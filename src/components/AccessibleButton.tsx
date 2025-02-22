import React from 'react';
import { Button, ButtonProps } from 'react-native-elements';

interface AccessibleButtonProps extends ButtonProps {
  accessibilityLabel?: string;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({ accessibilityLabel, ...props }) => {
  return (
    <Button
      {...props}
      accessibilityLabel={accessibilityLabel || props.title}
      accessibilityRole="button"
    />
  );
};

export default AccessibleButton;

