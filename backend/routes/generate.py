from flask import Blueprint, request, jsonify
from models import db, Project

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    idea = data.get("idea")

    if not idea or not idea.strip():
        return jsonify({"error": "'idea' field is required and cannot be empty"}), 400

    new_project = Project(idea=idea)
    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        "id": new_project.id,
        "received_idea": new_project.idea,
        "message": "Architecture generation coming soon"
    })

@generate_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()

    return jsonify([
        {
            "id": p.id,
            "idea": p.idea,
            "status": p.status,
            "created_at": p.created_at.isoformat()
        }
        for p in projects
    ])