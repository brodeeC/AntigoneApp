from flask import Blueprint, jsonify, request
from app import db, limiter
from app.models import FullText, LemmaData, LemmaDefinition
from app.utils import (
    clean_word,
    grk_to_eng,
    parse_postag,
    strip_accents,
    is_ancient_greek,
    MIN_LINE,
    MAX_LINE,
    FIRST_PAGE,
    LAST_PAGE
)
from app.database_helpers import (
    get_line,
    get_speaker,
    lookup_word_details,
    search_by_definition,
    get_word,
    get_word_defs
)
from http_status import HTTPStatus
import logging

bp = Blueprint('api', __name__, url_prefix='/AntigoneApp')
logger = logging.getLogger(__name__)

@bp.route('/get_all_speakers', methods=['GET'])  
@limiter.limit("50/minute")
def get_all_speakers():
    try:
        speakers = db.session.query(FullText.speaker).distinct().all()
        return jsonify([speaker[0] for speaker in speakers if speaker[0]])
    except Exception as e:
        logger.error(f"Error fetching speakers: {str(e)}")
        return jsonify({"error": "Internal server error"}), HTTPStatus.INTERNAL_SERVER_ERROR

@bp.route('/lines/<startLine>', defaults={'endLine': None}, methods=['GET'])
@bp.route('/lines/<startLine>/<endLine>', methods=['GET'])
@limiter.limit("100/minute")
def get_lines(startLine, endLine=None):
    try:
        # Validate and convert line numbers
        def validate_line_number(line_str, param_name):
            """Helper function to validate and convert a line number"""
            try:
                line_num = int(line_str)
                if not (MIN_LINE <= line_num <= MAX_LINE):
                    raise ValueError(
                        f"{param_name} must be between {MIN_LINE} and {MAX_LINE}"
                    )
                return line_num
            except ValueError as e:
                raise ValueError(
                    f"Invalid {param_name}: must be an integer between {MIN_LINE} and {MAX_LINE}"
                ) from e

        # Process start line
        start = validate_line_number(startLine, "start line")
        
        # Process end line if provided
        end = validate_line_number(endLine, "end line") if endLine else None

        # Handle single line request
        if end is None:
            line_text, speaker = get_line(start)
            if not line_text:
                return jsonify({"error": f"Line {start} not found"}), HTTPStatus.NOT_FOUND
                
            return jsonify([{
                "lineNum": start,
                "line_text": line_text,
                "speaker": speaker
            }])

        # Handle range request (ensure start <= end)
        if start > end:
            return jsonify({
                "error": "Start line must be less than or equal to end line"
            }), HTTPStatus.BAD_REQUEST

        # Fetch lines in range
        lines = []
        for line_num in range(start, end + 1):
            line_text, speaker = get_line(line_num)
            lines.append({
                "lineNum": line_num,
                "line_text": line_text,
                "speaker": speaker
            })

        return jsonify(lines)

    except ValueError as e:
        return jsonify({"error": str(e)}), HTTPStatus.BAD_REQUEST
    except Exception as e:
        logger.error(f"Unexpected error in get_lines: {str(e)}")
        return jsonify({
            "error": "An unexpected error occurred while processing your request"
        }), HTTPStatus.INTERNAL_SERVER_ERROR
    
@bp.route('/read/<int:page>', methods=['GET'])
@limiter.limit("100/minute")
def get_page(page):
    try:
        if page > LAST_PAGE or page < FIRST_PAGE:
            return jsonify({"error": f"Page number out of range ({FIRST_PAGE}-{LAST_PAGE})"}), HTTPStatus.BAD_REQUEST

        max_line = page * 11
        min_line = ((page - 1) * 11) + 1

        return get_lines(min_line, max_line)

    except Exception as e:
        logger.error(f"Error in get_page: {str(e)}")
        return jsonify({"error": "Internal server error"}), HTTPStatus.INTERNAL_SERVER_ERROR

@bp.route('/word-details/<word>', methods=['GET'])
@limiter.limit("50/minute")
def get_word_details(word):
    try:
        details = lookup_word_details(word)
        if not details:
            return jsonify({"error": "Word not found"}), HTTPStatus.NOT_FOUND
        return jsonify(details)
    except Exception as e:
        logger.error(f"Error in get_word_details: {str(e)}")
        return jsonify({"error": "Internal server error"}), HTTPStatus.INTERNAL_SERVER_ERROR

@bp.route('/search', methods=['GET'])
@limiter.limit("30/minute")
def search():
    try:
        mode = request.args.get('mode')
        query = request.args.get('q')
        logger.debug(f"Search request - mode: {mode}, query: {query}")

        if not query or not mode:
            return jsonify({'error': 'Missing parameters'}), HTTPStatus.BAD_REQUEST

        safe_query = query.strip()
        results = []

        if mode == 'definition':
            lemma_ids = search_by_definition(safe_query)
            logger.debug(f"Found lemma IDs: {lemma_ids}")
            
            for lemma_id in lemma_ids:
                word = get_word(lemma_id)
                if word:
                    word_data = lookup_word_details(word)
                    if word_data:
                        results.extend(word_data)

        elif mode == 'word':
            word_data = lookup_word_details(safe_query)
            if word_data:
                results.extend(word_data)
        else:
            return jsonify({'error': 'Invalid search mode'}), HTTPStatus.BAD_REQUEST

        return jsonify(results) if results else jsonify({"error": "No results found"}), HTTPStatus.NOT_FOUND

    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), HTTPStatus.INTERNAL_SERVER_ERROR

@bp.route("/health", methods=["GET"])
def health_check():
    return jsonify(status="ok"), HTTPStatus.OK