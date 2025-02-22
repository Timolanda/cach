import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface AccessibleTouchableProps extends TouchableOpacityProps {
  accessibilityLabel: string;
}

const AccessibleTouchable: React.FC<AccessibleTouchableProps> = ({
  accessibilityLabel,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    />
  );
};

export default AccessibleTouchable;

