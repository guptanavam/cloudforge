from flask import Flask
from routes.home import home_bp
from routes.generate import generate_bp

app = Flask(__name__)
app.register_blueprint(home_bp)
app.register_blueprint(generate_bp)

if __name__ == "__main__":
    app.run(debug=True)