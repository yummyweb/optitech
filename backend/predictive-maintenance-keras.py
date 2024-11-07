# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# import tensorflow as tf
# from tensorflow.keras.models import Sequential, load_model
# from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
# from tensorflow.keras.callbacks import EarlyStopping
# import joblib

# class MaintenancePredictor:
#     def __init__(self):
#         self.model = self._build_model()
#         self.scaler = StandardScaler()
        
#     def _build_model(self):
#         """Build a neural network model for maintenance prediction"""
#         model = Sequential([
#             Dense(64, activation='relu', input_shape=(5,)),
#             BatchNormalization(),
#             Dropout(0.3),
#             Dense(32, activation='relu'),
#             BatchNormalization(),
#             Dropout(0.2),
#             Dense(16, activation='relu'),
#             BatchNormalization(),
#             Dense(1, activation='sigmoid')
#         ])
        
#         model.compile(
#             optimizer='adam',
#             loss='binary_crossentropy',
#             metrics=['accuracy', tf.keras.metrics.AUC()]
#         )
        
#         return model
        
#     def generate_sample_data(self, n_samples=1000):
#         """Generate synthetic aircraft maintenance data with more realistic patterns"""
#         np.random.seed(42)
        
#         # Generate base values
#         flight_hours = np.random.uniform(0, 5000, n_samples)
#         cycles = flight_hours / 5 + np.random.normal(0, 50, n_samples)
        
#         # Create correlated features
#         engine_temp_base = 320 + (flight_hours / 5000) * 60
#         vibration_base = 0.3 + (cycles / 1000) * 0.4
#         fuel_consumption_base = 750 + (flight_hours / 5000) * 100
        
#         # Add noise and variations
#         data = {
#             'engine_temperature': engine_temp_base + np.random.normal(0, 15, n_samples),
#             'vibration_level': vibration_base + np.random.normal(0, 0.1, n_samples),
#             'fuel_consumption': fuel_consumption_base + np.random.normal(0, 50, n_samples),
#             'flight_hours': flight_hours,
#             'cycles': cycles
#         }
        
#         df = pd.DataFrame(data)
        
#         # Create maintenance_needed based on complex conditions
#         df['maintenance_needed'] = (
#             ((df['engine_temperature'] > 375) & (df['vibration_level'] > 0.6)) |
#             ((df['fuel_consumption'] > 900) & (df['flight_hours'] > 4000)) |
#             (df['cycles'] > 950) |
#             ((df['vibration_level'] > 0.7) & (df['flight_hours'] > 3500)) |
#             ((df['engine_temperature'] > 380) & (df['fuel_consumption'] > 850))
#         ).astype(int)
        
#         return df
    
#     def train(self, X, y):
#         """Train the maintenance prediction model with early stopping"""
#         X_scaled = self.scaler.fit_transform(X)
        
#         early_stopping = EarlyStopping(
#             monitor='val_loss',
#             patience=10,
#             restore_best_weights=True
#         )
        
#         history = self.model.fit(
#             X_scaled, y,
#             epochs=100,
#             batch_size=32,
#             validation_split=0.2,
#             callbacks=[early_stopping],
#             verbose=0
#         )
        
#         return history
        
#     def predict(self, X):
#         """Make predictions for new data"""
#         X_scaled = self.scaler.transform(X)
#         probabilities = self.model.predict(X_scaled, verbose=0)
#         predictions = (probabilities > 0.5).astype(int)
#         return predictions, probabilities
    
#     def get_feature_importance(self):
#         """Approximate feature importance using gradient-based approach"""
#         # Create a baseline input
#         baseline_input = np.zeros((1, 5))
#         baseline_input = self.scaler.transform(baseline_input)
        
#         # Calculate gradients for each feature
#         with tf.GradientTape() as tape:
#             inputs = tf.convert_to_tensor(baseline_input, dtype=tf.float32)
#             tape.watch(inputs)
#             predictions = self.model(inputs)
        
#         gradients = tape.gradient(predictions, inputs)
#         importance = np.abs(gradients.numpy()[0])
#         total = np.sum(importance)
        
#         # Normalize importance scores
#         if total > 0:
#             importance = importance / total
        
#         return dict(zip(
#             ['engine_temperature', 'vibration_level', 'fuel_consumption', 
#              'flight_hours', 'cycles'],
#             importance
#         ))
    
#     def save_model(self, filepath):
#         """Save the trained model and scaler"""
#         self.model.save(f"{filepath}_keras")
#         joblib.dump(self.scaler, f"{filepath}_scaler.joblib")
    
#     @classmethod
#     def load_model(cls, filepath):
#         """Load a trained model"""
#         predictor = cls()
#         predictor.model = load_model(f"{filepath}_keras")
#         predictor.scaler = joblib.load(f"{filepath}_scaler.joblib")
#         return predictor

# def main():
#     # Initialize predictor
#     predictor = MaintenancePredictor()
    
#     # Generate sample data
#     print("Generating training data...")
#     df = predictor.generate_sample_data(2000)
    
#     # Split features and target
#     X = df.drop('maintenance_needed', axis=1)
#     y = df['maintenance_needed']
    
#     # Split into training and testing sets
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42
#     )
    
#     # Train the model
#     print("Training model...")
#     history = predictor.train(X_train, y_train)
    
#     # Evaluate the model
#     X_test_scaled = predictor.scaler.transform(X_test)
#     test_results = predictor.model.evaluate(X_test_scaled, y_test, verbose=0)
#     print(f"Test accuracy: {test_results[1]:.4f}")
#     print(f"Test AUC: {test_results[2]:.4f}")
    
#     # Save the model
#     predictor.save_model('maintenance_model')
    
#     return predictor

# if __name__ == "__main__":
#     main()
