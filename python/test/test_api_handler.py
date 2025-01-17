import unittest
from unittest.mock import patch
from Python.utilities.api_handler import APIHandler

class TestAPIHandler(unittest.TestCase):
    @patch("Python.utilities.api_handler.requests.get")
    def test_get(self, mock_get):
        mock_get.return_value.json.return_value = {"message": "success"}
        mock_get.return_value.status_code = 200

        response = APIHandler.get("https://example.com/api")
        self.assertEqual(response, {"message": "success"})

    @patch("Python.utilities.api_handler.requests.post")
    def test_post(self, mock_post):
        mock_post.return_value.json.return_value = {"message": "created"}
        mock_post.return_value.status_code = 201

        response = APIHandler.post("https://example.com/api", data={"key": "value"})
        self.assertEqual(response, {"message": "created"})

    @patch("Python.utilities.api_handler.requests.put")
    def test_put(self, mock_put):
        mock_put.return_value.json.return_value = {"message": "updated"}
        mock_put.return_value.status_code = 200

        response = APIHandler.put("https://example.com/api", data={"key": "value"})
        self.assertEqual(response, {"message": "updated"})

if __name__ == "__main__":
    unittest.main()
