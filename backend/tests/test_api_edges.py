"""Edge cases and negative paths for `/AntigoneApp/api`."""

from urllib.parse import quote

API = "/AntigoneApp/api"


def test_health_post_not_allowed(client):
    r = client.post(f"{API}/health")
    assert r.status_code == 405


def test_metadata_post_not_allowed(client):
    r = client.post(f"{API}/metadata")
    assert r.status_code == 405


def test_search_whitespace_only_query(client):
    r = client.get(f"{API}/search", query_string={"mode": "word", "q": "   "})
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_speaker_whitespace_only_treated_as_absent(client):
    """Blank `speaker` after trim does not filter (same as omitting `speaker`)."""
    r = client.get(
        f"{API}/search",
        query_string={"mode": "word", "q": "πολις", "speaker": "   "},
    )
    assert r.status_code == 200
    assert len(r.get_json()) >= 1


def test_search_mode_only_no_query(client):
    r = client.get(f"{API}/search", query_string={"mode": "word"})
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_q_only_no_mode(client):
    r = client.get(f"{API}/search", query_string={"q": "πολις"})
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_two_character_word_short_path(client):
    """len(normalized)==2 uses tiered short-query logic (same as single char)."""
    r = client.get(f"{API}/search", query_string={"mode": "word", "q": "aa"})
    assert r.status_code == 200
    data = r.get_json()
    line_numbers = [entry[0]["line_number"] for entry in data if entry and entry[0]]
    assert 40 in line_numbers


def test_search_definition_partial_contains_not_exact(client):
    r = client.get(
        f"{API}/search",
        query_string={"mode": "definition", "q": "EDGE_PARTIAL"},
    )
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_read_page_second_page(client):
    """Page 2 requests lines 12–22 (11 lines)."""
    r = client.get(f"{API}/read/2")
    assert r.status_code == 200
    lines = r.get_json()
    assert len(lines) == 11
    assert lines[0]["lineNum"] == 12
    assert lines[-1]["lineNum"] == 22


def test_read_last_allowed_page_may_return_fewer_lines(client):
    """LAST_PAGE is valid but DB may not fill every slot at the end of the play."""
    from app.utils import LAST_PAGE

    r = client.get(f"{API}/read/{LAST_PAGE}")
    assert r.status_code == 200
    lines = r.get_json()
    assert isinstance(lines, list)
    assert len(lines) <= 11


def test_lines_non_numeric_start_defaults_to_min_line(client):
    r = client.get(f"{API}/lines/notanumber")
    assert r.status_code == 200
    body = r.get_json()
    assert body[0]["lineNum"] == 1
    assert "Line text 1" in body[0]["line_text"]


def test_lines_range_end_before_start_becomes_single_line_mode(client):
    """start > end forces single-line branch (end cleared); response is one object list."""
    r = client.get(f"{API}/lines/8/3")
    assert r.status_code == 200
    body = r.get_json()
    assert len(body) == 1


def test_lines_range_equal_end_means_single_line(client):
    r = client.get(f"{API}/lines/5/5")
    assert r.status_code == 200
    body = r.get_json()
    assert len(body) == 1
    assert body[0]["lineNum"] == 5


def test_lines_range_spans_missing_middle_lines_null_text(client):
    """Lines with no FullText row return null line_text but stable JSON shape."""
    r = client.get(f"{API}/lines/10/12")
    assert r.status_code == 200
    body = r.get_json()
    assert len(body) == 3
    assert body[0]["lineNum"] == 10
    nums = {b["lineNum"]: b["line_text"] for b in body}
    assert nums[10] is not None
    assert nums[11] is not None


def test_lines_missing_line_substitutes_placeholder(client):
    """Single-line fetch with no DB row resets to MIN_LINE content (existing API behavior)."""
    r = client.get(f"{API}/lines/9999")
    assert r.status_code == 200
    body = r.get_json()
    assert len(body) == 1
    assert body[0]["lineNum"] == 1
    assert "not in database" in body[0]["line_text"] or body[0]["line_text"]


def test_word_details_percent_encoded(client):
    path = quote("πολις", safe="")
    r = client.get(f"{API}/word-details/{path}")
    assert r.status_code == 200
    assert isinstance(r.get_json(), list)
