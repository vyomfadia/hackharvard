#define ANALOG_MAX 4095  // Maximum value for 12-bit ADC

void setup() {
  Serial.begin(9600);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
}

void loop() {
  int heelRaw = analogRead(A0);
  int leftRaw = analogRead(A1);
  int rightRaw = analogRead(A3);

  float heelVoltage = heelRaw * (5.f / ANALOG_MAX);
  float leftVoltage = leftRaw * (5.f / ANALOG_MAX);
  float rightVoltage = rightRaw * (5.f / ANALOG_MAX);

  // deliberately flipped
  Serial.printf("{\"heel\": %f, \"left\": %f, \"right\": %f}\n", heelVoltage, rightVoltage, leftVoltage);
  delay(50);
}