
float linear(float x) {
    float X = clamp(x, 0.0, 1.0);
    return X;
}

float cubic_in_out(float x) {
    float X = clamp(x, 0.0, 1.0);
    if (X < 0.5) {
        return 4.0 * pow(X, 3.0) ;
    }
    else if (X <= 1.0) {
        return 1.0 - pow(-2.0 * X + 2.0, 3.0) / 2.0;
    }
}

// float sine_out(float x) {
//   float X = clamp(x, 0.0, 1.0);
//   return Math.sin((X * Math.PI) / 2);
// }

float quadratic_out(float x) {
    float X = clamp(x, 0.0, 1.0);
    return X * X;
}