import os
from flask import Flask
from dotenv import load_dotenv
from flask_migrate import Migrate
from models import db
from routes.home import home_bp
from routes.generate import generate_bp

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(home_bp)
app.register_blueprint(generate_bp)

if __name__ == "__main__":
    app.run(debug=True)