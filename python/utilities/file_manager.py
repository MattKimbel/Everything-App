import os
from typing import List, Optional

class FileManager:
    """
    A utility class for managing files, designed to handle common file-related operations.
    """

    @staticmethod
    def read_file(file_path: str) -> Optional[str]:
        """
        Reads the content of a file.

        Args:
            file_path (str): The path to the file to be read.

        Returns:
            str: The content of the file, or None if the file doesn't exist.
        """
        try:
            with open(file_path, 'r') as file:
                return file.read()
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return None

    @staticmethod
    def write_file(file_path: str, content: str, append: bool = False) -> None:
        """
        Writes content to a file. Creates the file if it doesn't exist.

        Args:
            file_path (str): The path to the file to write to.
            content (str): The content to write.
            append (bool): Whether to append to the file (default: False).
        """
        mode = 'a' if append else 'w'
        with open(file_path, mode) as file:
            file.write(content)
        print(f"Content written to {file_path}.")

    @staticmethod
    def search_in_file(file_path: str, keyword: str) -> List[int]:
        """
        Searches for a keyword in a file and returns the line numbers where the keyword is found.

        Args:
            file_path (str): The path to the file to search in.
            keyword (str): The keyword to search for.

        Returns:
            List[int]: A list of line numbers where the keyword is found.
        """
        line_numbers = []
        try:
            with open(file_path, 'r') as file:
                for i, line in enumerate(file, start=1):
                    if keyword in line:
                        line_numbers.append(i)
        except FileNotFoundError:
            print(f"File not found: {file_path}")
        return line_numbers

    @staticmethod
    def delete_file(file_path: str) -> bool:
        """
        Deletes a file if it exists.

        Args:
            file_path (str): The path to the file to be deleted.

        Returns:
            bool: True if the file was deleted, False otherwise.
        """
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File deleted: {file_path}")
            return True
        print(f"File not found: {file_path}")
        return False
