from flask import Blueprint, request, jsonify
from models import db, Project
from ai_service import generate_architecture
from google.genai.errors import ClientError

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    idea = data.get("idea")

    if not idea or not idea.strip():
        return jsonify({"error": "'idea' field is required and cannot be empty"}), 400

    expected_users = data.get("expected_users")

    try:
        architecture = generate_architecture(idea, expected_users)
    except ClientError as e:
        if e.code == 429:
            return jsonify({
                "error": "AI service rate limit reached. Please wait a moment and try again."
            }), 429
        return jsonify({
            "error": "AI service returned an error. Please try again."
        }), 502
    except Exception as e:
        return jsonify({
            "error": "Could not generate architecture right now. Please try again."
        }), 502

    new_project = Project(idea=idea, expected_users=expected_users)
    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        "id": new_project.id,
        "received_idea": new_project.idea,
        "expected_users": new_project.expected_users,
        "architecture": architecture
    })