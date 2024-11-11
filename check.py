import pandas as pd

# Load the CSV file
csv_file_path = 'cleaned_data.csv'  # Replace with your file path
df = pd.read_csv(csv_file_path)

# Display basic information about the dataset
print("Basic Information:")
print(df.info())  # Shows column names, data types, and non-null counts

# Check for duplicate rows
duplicates = df[df.duplicated()]

if not duplicates.empty:
    print("Duplicate rows found:")
    print(duplicates)
else:
    print("No duplicate rows found.")

# Remove duplicates
df_cleaned = df.drop_duplicates()

# Optional: To update data (for example, if you have new CSV data and want to update)
# Assume new_data is another DataFrame containing updated records
# new_data = pd.read_csv('new_data.csv')

# Example of updating specific columns (if you had some condition)
# df_cleaned.update(new_data)  # Update data based on matching indices

# Save the cleaned data back to CSV
df_cleaned.to_csv('cleaned_data.csv', index=False)

print("Duplicates removed and cleaned data saved to 'cleaned_data.csv'.")
