import unittest
from Python.utilities.data_processor import DataProcessor

class TestDataProcessor(unittest.TestCase):
    def setUp(self):
        self.data = [
            {"id": 1, "name": "Alice", "age": 25, "score": 85},
            {"id": 2, "name": "Bob", "age": 30, "score": 90},
            {"id": 3, "name": "Charlie", "age": 25, "score": 95},
            {"id": 4, "name": "David", "age": 35, "score": 80},
        ]

    def test_filter_data(self):
        result = DataProcessor.filter_data(self.data, lambda x: x["age"] == 25)
        expected = [
            {"id": 1, "name": "Alice", "age": 25, "score": 85},
            {"id": 3, "name": "Charlie", "age": 25, "score": 95},
        ]
        self.assertEqual(result, expected)

    def test_sort_data(self):
        result = DataProcessor.sort_data(self.data, key="score")
        expected = [
            {"id": 4, "name": "David", "age": 35, "score": 80},
            {"id": 1, "name": "Alice", "age": 25, "score": 85},
            {"id": 2, "name": "Bob", "age": 30, "score": 90},
            {"id": 3, "name": "Charlie", "age": 25, "score": 95},
        ]
        self.assertEqual(result, expected)

    def test_group_data(self):
        result = DataProcessor.group_data(self.data, key="age")
        expected = {
            25: [
                {"id": 1, "name": "Alice", "age": 25, "score": 85},
                {"id": 3, "name": "Charlie", "age": 25, "score": 95},
            ],
            30: [{"id": 2, "name": "Bob", "age": 30, "score": 90}],
            35: [{"id": 4, "name": "David", "age": 35, "score": 80}],
        }
        self.assertEqual(result, expected)

    def test_aggregate_data(self):
        result = DataProcessor.aggregate_data(self.data, key="score", operation=sum)
        expected = 350
        self.assertEqual(result, expected)

if __name__ == "__main__":
    unittest.main()
