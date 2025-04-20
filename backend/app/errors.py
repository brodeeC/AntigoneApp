from flask import Blueprint, jsonify
from http_status import HTTPStatus

bp = Blueprint('errors', __name__)

@bp.app_errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), HTTPStatus.NOT_FOUND

@bp.app_errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), HTTPStatus.INTERNAL_SERVER_ERROR

@bp.app_errorhandler(429)
def ratelimit_error(error):
    return jsonify({
        'error': 'Rate limit exceeded',
        'detail': str(error.description)
    }), HTTPStatus.TOO_MANY_REQUESTS