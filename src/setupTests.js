// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'react-app-polyfill/jsdom';
import '@testing-library/jest-dom';

// jsdom does not implement scrolling; the app scrolls to the top on navigation.
window.scrollTo = jest.fn();
