from tensorflow import keras
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import MinMaxScaler
import pickle
import joblib

index_names = ['engine', 'cycle']
setting_names = ['setting_1', 'setting_2', 'setting_3']
sensor_names = ["(Fan inlet temperature) (◦R)",
                "(LPC outlet temperature) (◦R)",
                "(HPC outlet temperature) (◦R)",
                "(LPT outlet temperature) (◦R)",
                "(Fan inlet Pressure) (psia)",
                "(bypass-duct pressure) (psia)",
                "(HPC outlet pressure) (psia)",
                "(Physical fan speed) (rpm)",
                "(Physical core speed) (rpm)",
                "(Engine pressure ratio(P50/P2)",
                "(HPC outlet Static pressure) (psia)",
                "(Ratio of fuel flow to Ps30) (pps/psia)",
                "(Corrected fan speed) (rpm)",
                "(Corrected core speed) (rpm)",
                "(Bypass Ratio) ",
                "(Burner fuel-air ratio)",
                "(Bleed Enthalpy)",
                "(Required fan speed)",
                "(Required fan conversion speed)",
                "(High-pressure turbines Cool air flow)",
                "(Low-pressure turbines Cool air flow)"]
col_names = index_names + setting_names + sensor_names
feature_names = ['cycle', '(LPC outlet temperature) (◦R)', '(HPC outlet temperature) (◦R)', '(LPT outlet temperature) (◦R)', '(bypass-duct pressure) (psia)', '(HPC outlet pressure) (psia)', '(Physical fan speed) (rpm)', '(Physical core speed) (rpm)',
                 '(HPC outlet Static pressure) (psia)', '(Ratio of fuel flow to Ps30) (pps/psia)', '(Corrected fan speed) (rpm)', '(Bypass Ratio) ', '(Bleed Enthalpy)', '(High-pressure turbines Cool air flow)', '(Low-pressure turbines Cool air flow)']
sens_const_values = ['setting_3', '(Fan inlet temperature) (◦R)', '(Fan inlet Pressure) (psia)', '(Engine pressure ratio(P50/P2)',
                     '(Burner fuel-air ratio)', '(Required fan speed)', '(Required fan conversion speed)']
corr_features = ['(Corrected core speed) (rpm)']


class MaintenancePredictor:
    def __init__(self, filepath):
        # self.model = keras.models.load_model(filepath)
        df_train = pd.read_csv(
            ('./PM_train.txt'), sep='\s+', header=None, names=col_names)
        df_train.drop(sens_const_values, axis=1, inplace=True)
        df_train.drop(corr_features, axis=1, inplace=True)
        df_train_RUL = df_train.groupby(['engine']).agg({'cycle': 'max'})
        df_train_RUL.rename(columns={'cycle': 'life'}, inplace=True)
        df_train = df_train.merge(df_train_RUL, how='left', on=['engine'])
        df_train['RUL'] = df_train['life']-df_train['cycle']
        df_train.drop(['life'], axis=1, inplace=True)
        X_train = df_train[feature_names]
        self.train = X_train

        with open('model.pkl', 'rb') as f:
            self.model = pickle.load(f)

    def load_input(self, X):
        df_x = pd.read_csv((X), sep='\s+',
                           header=None, names=col_names)
        df_x.drop(sens_const_values, axis=1, inplace=True)
        df_x.drop(corr_features, axis=1, inplace=True)

        df_x_cycle = df_x.groupby(['engine']).agg({'cycle': 'max'})
        df_x_cycle.rename(columns={'cycle': 'life'}, inplace=True)
        df_x_max = df_x.merge(df_x_cycle, how='left', on=['engine'])
        df_x_max = df_x_max[(df_x_max['cycle'] == df_x_max['life'])]
        df_x_max.drop(['life'], axis=1, inplace=True)
        return self.process(df_x_max[feature_names])

    def fetch_features(self, X):
        df_x = pd.read_csv((X), sep='\s+',
                           header=None, names=col_names)
        df_x.drop(sens_const_values, axis=1, inplace=True)
        df_x.drop(corr_features, axis=1, inplace=True)

        df_x_cycle = df_x.groupby(['engine']).agg({'cycle': 'max'})
        df_x_cycle.rename(columns={'cycle': 'life'}, inplace=True)
        df_x_max = df_x.merge(df_x_cycle, how='left', on=['engine'])
        df_x_max = df_x_max[(df_x_max['cycle'] == df_x_max['life'])]
        df_x_max.drop(['life'], axis=1, inplace=True)

        res = {}
        for feat in feature_names:
            res[feat] = list(df_x_max[feat].to_dict().values())[0]

        return res

    def process(self, X):
        """Preprocess the data"""
        sc = MinMaxScaler()
        X_train = sc.fit(self.train)

        # scaler = joblib.load("scaler.save")
        X_scaled = sc.transform(X)
        return X_scaled

    def predict(self, X):
        """Make predictions for new data"""
        y_model_estimator_pred_test = self.model.predict(X)
        return y_model_estimator_pred_test

    # @classmethod
    # def load_model(filepath):
    #     """Load a trained model"""
    #     self.model = keras.models.load_model(filepath)
    #     return model
