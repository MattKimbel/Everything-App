import requests
from typing import Dict, Any, Optional

class APIHandler:
    """
    A utility class for handling API requests, including GET, POST, and PUT operations.
    """

    @staticmethod
    def get(url: str, headers: Optional[Dict[str, str]] = None, params: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Sends a GET request to the specified URL.

        Args:
            url (str): The API endpoint.
            headers (Optional[Dict[str, str]]): Optional headers for the request.
            params (Optional[Dict[str, str]]): Optional query parameters for the request.

        Returns:
            Dict[str, Any]: The JSON response or an error message.
        """
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    @staticmethod
    def post(url: str, data: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Sends a POST request to the specified URL.

        Args:
            url (str): The API endpoint.
            data (Optional[Dict[str, Any]]): The payload to send in the request body.
            headers (Optional[Dict[str, str]]): Optional headers for the request.

        Returns:
            Dict[str, Any]: The JSON response or an error message.
        """
        try:
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    @staticmethod
    def put(url: str, data: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Sends a PUT request to the specified URL.

        Args:
            url (str): The API endpoint.
            data (Optional[Dict[str, Any]]): The payload to send in the request body.
            headers (Optional[Dict[str, str]]): Optional headers for the request.

        Returns:
            Dict[str, Any]: The JSON response or an error message.
        """
        try:
            response = requests.put(url, json=data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
