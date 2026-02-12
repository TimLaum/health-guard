from .predict import MedicalAnalyzer, get_analyzer

def analyze_image(image_file, analysis_type, sex):

    analyzer = get_analyzer()
    if not analyzer:
        raise ValueError("Analyseur non disponible")
    
    result = analyzer.analyze(image_file, analysis_type, sexe=sex)

    if not result or not result.get('success'):
        error_msg = result.get('error', 'Analyse échouée') if result else 'Résultat vide'
        raise ValueError(error_msg)

    return result

