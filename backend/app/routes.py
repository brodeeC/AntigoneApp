from flask import Blueprint, jsonify, request
from app import db, limiter
from app.models import FullText, LemmaData, LemmaDefinition
from flask import send_from_directory
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
    get_word_defs,
)
from http import HTTPStatus
import logging

bp = Blueprint('api', __name__, url_prefix='/AntigoneApp/api')
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
        try: 
            start = int(startLine)
            if endLine != None: 
                try: 
                    end = int(endLine)
                except:
                    end = start + 10
            else: end = None
        except:
            start = MIN_LINE

        if end and end > MAX_LINE: end = MAX_LINE

        if end and end < MIN_LINE: end = None

        if start < MIN_LINE: start = MIN_LINE

        if start > MAX_LINE: start = MAX_LINE

        if end and (start > end or end < start or end == start):
            end = None


        # Handle single line request
        if end is None:
            line_text, speaker = get_line(start)
            if not line_text:
                start = MIN_LINE
                line_text, speaker = get_line(start);
                
            return jsonify([{
                "lineNum": start,
                "line_text": line_text,
                "speaker": speaker
            }])        

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
        if page < FIRST_PAGE or page > LAST_PAGE:
            return jsonify({"error": "Invalid page number"}), HTTPStatus.BAD_REQUEST

        lines_per_page = 11
        start_line = (page - 1) * lines_per_page + 1
        end_line = page * lines_per_page

        # Use SQLAlchemy session correctly
        lines = db.session.query(FullText).filter(
            FullText.line_number.between(start_line, end_line)
        ).order_by(FullText.line_number).all()

        return jsonify([{
            "lineNum": line.line_number,
            "line_text": line.line_text,
            "speaker": line.speaker
        } for line in lines])

    except Exception as e:
        logger.error(f"Error in get_page: {str(e)}")
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    
@bp.route("/health", methods=["GET"])
def health_check():
    return jsonify(status="ok"), HTTPStatus.OK

@bp.route('/search', methods=['GET'])
@limiter.limit("10 per minute")
def search():
    logger.info("\n=== NEW SEARCH REQUEST ===")
    logger.info(f"Request args: {request.args}")
    
    mode = request.args.get('mode')
    query = request.args.get('q')
    
    if not query or not mode:
        logger.warning("Missing search parameters")
        return jsonify([]), HTTPStatus.OK  # Gracefully return empty list

    safe_query = query.strip()
    results = []

    try:
        if mode == 'definition':
            lemma_keys = search_by_definition(safe_query)
            for lemma_id, line_number in lemma_keys:
                word = LemmaData.query.filter_by(
                    lemma_id=lemma_id,
                    line_number=line_number
                ).first()
                if word:
                    word_data = lookup_word_details(word.lemma)
                    if word_data:
                        results.extend(word_data)

        elif mode == 'word':
            results = lookup_word_details(safe_query)
        else:
            logger.warning("Invalid search mode")
            return jsonify([]), HTTPStatus.OK  # Invalid mode = empty list

        logger.info(f"Returning {len(results)} results")
        return jsonify(results)

    except Exception as e:
        logger.error(f"Search error: {str(e)}", exc_info=True)
        return jsonify([]), HTTPStatus.OK  # Always return an empty list on error
    
@bp.route('/word-details/<word>', methods=['GET'])
@limiter.limit("200 per minute")
def get_word_details(word):
    
    return jsonify(lookup_word_details(word))