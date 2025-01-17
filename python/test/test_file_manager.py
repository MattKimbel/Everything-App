import unittest
import os
from Python.utilities.file_manager import FileManager

class TestFileManager(unittest.TestCase):
    def setUp(self):
        self.test_file = "test.txt"
        self.content = "Hello, World!\nThis is a test file.\nPython is great."

    def test_write_and_read_file(self):
        FileManager.write_file(self.test_file, self.content)
        self.assertEqual(FileManager.read_file(self.test_file), self.content)

    def test_search_in_file(self):
        FileManager.write_file(self.test_file, self.content)
        result = FileManager.search_in_file(self.test_file, "test")
        self.assertEqual(result, [2])

    def test_delete_file(self):
        FileManager.write_file(self.test_file, self.content)
        self.assertTrue(FileManager.delete_file(self.test_file))
        self.assertFalse(os.path.exists(self.test_file))

    def tearDown(self):
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

if __name__ == "__main__":
    unittest.main()
