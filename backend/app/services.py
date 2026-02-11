from .predict import MedicalAnalyzer, get_analyzer

def analyze_image(image_file, analysis_type, sex):

    analyzer = get_analyzer()
    if not analyzer:
        raise ValueError("Invalid analysis type")
    
    result = analyzer.analyze(image_file, analysis_type, sexe=sex)
    print("Result from analyzer:", result)
    diagnostic = []
    if analysis_type == "skin" and result :
        for r in result['predictions']:
            print(r)
            diagnostic.append(r['disease'])
            return diagnostic
    return result

    
