from skemabase_py import parse

def test_parse_returns_dict():
    result = parse("")
    assert isinstance(result, dict)