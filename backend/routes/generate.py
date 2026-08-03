from flask import Blueprint, request, jsonify

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    idea = data.get("idea")

    return jsonify({
        "received_idea": idea,
        "message": "Architecture generation coming soon"
    })