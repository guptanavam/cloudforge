from flask import Blueprint, request, jsonify

generate_bp = Blueprint("generate", __name__)

@generate_bp.route("/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({"error": "Request body must be valid JSON"}), 400

    idea = data.get("idea")

    if not idea or not idea.strip():
        return jsonify({"error": "'idea' field is required and cannot be empty"}), 400

    return jsonify({
        "received_idea": idea,
        "message": "Architecture generation coming soon"
    })