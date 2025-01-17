from typing import List, Dict, Callable, Any, Optional

class DataProcessor:
    """
    A utility class for processing data, designed to handle common data transformation and analysis tasks.
    """

    @staticmethod
    def filter_data(data: List[Dict[str, Any]], condition: Callable[[Dict[str, Any]], bool]) -> List[Dict[str, Any]]:
        """
        Filters a list of dictionaries based on a condition.

        Args:
            data (List[Dict[str, Any]]): The data to filter.
            condition (Callable[[Dict[str, Any]], bool]): A function that returns True for items to keep.

        Returns:
            List[Dict[str, Any]]: A filtered list of dictionaries.
        """
        return [item for item in data if condition(item)]

    @staticmethod
    def sort_data(data: List[Dict[str, Any]], key: str, reverse: bool = False) -> List[Dict[str, Any]]:
        """
        Sorts a list of dictionaries based on a specified key.

        Args:
            data (List[Dict[str, Any]]): The data to sort.
            key (str): The key to sort by.
            reverse (bool): Whether to sort in descending order (default: False).

        Returns:
            List[Dict[str, Any]]: A sorted list of dictionaries.
        """
        return sorted(data, key=lambda x: x.get(key, None), reverse=reverse)

    @staticmethod
    def group_data(data: List[Dict[str, Any]], key: str) -> Dict[Any, List[Dict[str, Any]]]:
        """
        Groups a list of dictionaries by a specified key.

        Args:
            data (List[Dict[str, Any]]): The data to group.
            key (str): The key to group by.

        Returns:
            Dict[Any, List[Dict[str, Any]]]: A dictionary where each key corresponds to a group of items.
        """
        grouped_data = {}
        for item in data:
            group_key = item.get(key)
            if group_key not in grouped_data:
                grouped_data[group_key] = []
            grouped_data[group_key].append(item)
        return grouped_data

    @staticmethod
    def aggregate_data(
        data: List[Dict[str, Any]], key: str, operation: Callable[[List[Any]], Any]
    ) -> Any:
        """
        Aggregates data based on a specified key and operation.

        Args:
            data (List[Dict[str, Any]]): The data to aggregate.
            key (str): The key to aggregate on.
            operation (Callable[[List[Any]], Any]): A function to perform aggregation.

        Returns:
            Any: The aggregated result.
        """
        values = [item.get(key, 0) for item in data if key in item]
        return operation(values)
