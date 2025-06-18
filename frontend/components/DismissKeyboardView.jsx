import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

const DismissKeyboardView = ({ children, style }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    
    <View style={style}>
        {children}
    </View>

  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;