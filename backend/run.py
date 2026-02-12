from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Use DEBUG environment variable (default: False for security)
    debug_mode = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)