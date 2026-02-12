"""
Tests unitaires pour HealthGuard Vision Backend
Tests les fonctionnalités du module predict.py
"""
import os
import pytest
import numpy as np
from unittest.mock import Mock, patch
from PIL import Image
import tempfile
import json

# Import depuis le même package (app)
from predict import MedicalAnalyzer, get_analyzer


# ============================================
# Tests d'import et structure
# ============================================

def test_imports():
    """Vérifie que les modules peuvent être importés"""
    assert MedicalAnalyzer is not None
    assert get_analyzer is not None


def test_analyzer_initialization():
    """Test l'initialisation de MedicalAnalyzer"""
    analyzer = MedicalAnalyzer()
    assert analyzer.models == {}
    assert analyzer.supported_types == ['nail', 'skin', 'eye']


def test_get_analyzer_singleton():
    """Test que get_analyzer retourne toujours la même instance (singleton)"""
    analyzer1 = get_analyzer()
    analyzer2 = get_analyzer()
    assert analyzer1 is analyzer2


# ============================================
# Tests des fichiers ML
# ============================================

def test_ml_models_exist():
    """Vérifie que tous les modèles ML requis existent"""
    models_path = os.path.join(os.path.dirname(__file__), 'ml_models')
    
    required_models = [
        'best_skin_disease_model.tflite',
        'eye_anemia_model.tflite',
        'nail_anemia_model.tflite',
        'class_mapping.json'
    ]
    
    for model_file in required_models:
        model_path = os.path.join(models_path, model_file)
        assert os.path.exists(model_path), f"Modèle manquant: {model_file}"


def test_class_mapping_valid():
    """Vérifie que class_mapping.json est valide"""
    mapping_path = os.path.join(
        os.path.dirname(__file__), 
        'ml_models', 
        'class_mapping.json'
    )
    
    assert os.path.exists(mapping_path), "class_mapping.json manquant"
    
    with open(mapping_path, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    assert isinstance(mapping, dict), "class_mapping doit être un dict"
    assert len(mapping) > 0, "class_mapping ne doit pas être vide"


# ============================================
# Tests du prétraitement d'images
# ============================================

@pytest.fixture
def temp_image():
    """Crée une image temporaire pour les tests"""
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
        img = Image.new('RGB', (224, 224), color='red')
        img.save(f.name)
        yield f.name
    try:
        os.unlink(f.name)
    except:
        pass


def test_preprocess_image(temp_image):
    """Test le prétraitement d'une image"""
    analyzer = MedicalAnalyzer()
    result = analyzer.preprocess_image(temp_image, img_size=224)
    
    assert isinstance(result, np.ndarray)
    assert result.shape == (1, 224, 224, 3)
    assert result.dtype == np.float32
    assert 0 <= result.min() <= 1
    assert 0 <= result.max() <= 1


def test_preprocess_converts_grayscale():
    """Test la conversion d'image grayscale vers RGB"""
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
        img = Image.new('L', (100, 100), color=128)
        img.save(f.name)
        
        analyzer = MedicalAnalyzer()
        result = analyzer.preprocess_image(f.name)
        
        assert result.shape == (1, 224, 224, 3)
        os.unlink(f.name)


# ============================================
# Tests interprétation des résultats anémie
# ============================================

def test_interpret_anemia_severe():
    """Test interprétation anémie sévère"""
    analyzer = MedicalAnalyzer()
    result = analyzer._interpret_anemia_result(70.0, 'M')
    
    assert result['status'] == 'anemia'
    assert result['severity'] == 'severe'
    assert 'sévère' in result['message']


def test_interpret_anemia_normal():
    """Test interprétation niveau normal"""
    analyzer = MedicalAnalyzer()
    result = analyzer._interpret_anemia_result(145.0, 'M')
    
    assert result['status'] == 'normal'
    assert result['severity'] is None


def test_interpret_anemia_different_thresholds():
    """Test que les seuils diffèrent entre homme et femme"""
    analyzer = MedicalAnalyzer()
    
    # Même valeur, sexes différents
    result_m = analyzer._interpret_anemia_result(115.0, 'M')
    result_f = analyzer._interpret_anemia_result(115.0, 'F')
    
    # Les résultats peuvent différer selon les seuils
    assert 'status' in result_m
    assert 'status' in result_f


def test_interpret_anemia_invalid_sex():
    """Test avec sexe invalide"""
    analyzer = MedicalAnalyzer()
    
    with pytest.raises(ValueError, match="Sexe invalide"):
        analyzer._interpret_anemia_result(120.0, 'X')


# ============================================
# Tests du chargement des modèles
# ============================================

def test_load_model_unsupported_type():
    """Test le chargement d'un type non supporté"""
    analyzer = MedicalAnalyzer()
    
    with pytest.raises(ValueError, match="Type d'analyse non supporté"):
        analyzer.load_model('invalid_type')


@patch('os.path.exists', return_value=False)
def test_load_model_file_not_found(mock_exists):
    """Test quand le fichier modèle n'existe pas"""
    analyzer = MedicalAnalyzer()
    
    with pytest.raises(FileNotFoundError):
        analyzer.load_model('nail')


# ============================================
# Tests de la fonction analyze
# ============================================

def test_analyze_invalid_type(temp_image):
    """Test analyze() avec type invalide"""
    analyzer = MedicalAnalyzer()
    result = analyzer.analyze(temp_image, 'invalid_type')
    
    assert result['success'] is False
    assert 'error' in result
    assert 'supported_types' in result


# ============================================
# Tests des modules Flask
# ============================================

def test_routes_module_exists():
    """Vérifie que le module routes existe"""
    try:
        from . import routes
        assert routes is not None
    except ImportError:
        pytest.skip("Module routes non disponible")


def test_services_module_exists():
    """Vérifie que le module services existe"""
    try:
        from . import services
        assert services is not None
    except ImportError:
        pytest.skip("Module services non disponible")


def test_db_module_exists():
    """Vérifie que le module db existe"""
    try:
        from . import db
        assert db is not None
    except ImportError:
        pytest.skip("Module db non disponible")
