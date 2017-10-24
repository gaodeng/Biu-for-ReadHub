import { StyleSheet } from 'react-native';
const triggerStyles = {
  triggerText: {
    color: 'black',
  },
  triggerOuterWrapper: {
    // backgroundColor: 'orange',
    padding: 5,
    flex: 1,
  },
  triggerWrapper: {
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    flex: 1,
  },
  triggerTouchable: {
    // underlayColor: '#ff0000',
    activeOpacity: 70,
    style: {
      flex: 1,
    },
  },
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#ffffff',
    padding: 2,
    shadowOpacity: 0.08,
    borderWidth: 1,
    borderColor: '#eaeaea',
    marginTop: 10,
    marginLeft: -10,
    elevation: 0
  },
  optionsWrapper: {
    // backgroundColor: 'purple',

  },
  optionWrapper: {
    // backgroundColor: 'yellow',
    margin: 5,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'brown',
  },
};

const optionStyles = {
  optionTouchable: {
    // underlayColor: 'red',
    activeOpacity: 40,
  },
  optionWrapper: {
    // backgroundColor: 'pink',
    margin: 5,
  },
  optionText: {
    color: 'black',
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 0,
  },
  backdrop: {
    backgroundColor: '#222222',
    opacity: 0.1,
  },
});

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};


export default { triggerStyles, optionsStyles, optionStyles, menuContextStyles }
