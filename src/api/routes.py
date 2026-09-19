"""Authentication endpoints for the application."""

from flask import Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)

from api.models import User, db


api = Blueprint("api", __name__)
CORS(api)


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must have at least 6 characters"}), 400

    existing_user = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()
    if existing_user is not None:
        return jsonify({"message": "Email is already registered"}), 409

    user = User(email=email, is_active=True)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created", "user": user.serialize()}), 201


@api.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = db.session.execute(
        db.select(User).filter_by(email=email)
    ).scalar_one_or_none()
    if user is None or not user.is_active or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


@api.route("/private", methods=["GET"])
@jwt_required()
def private():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    if user is None or not user.is_active:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "message": "Access granted",
        "user": user.serialize(),
    }), 200


@api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Authentication API is running"}), 200
