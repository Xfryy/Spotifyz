
declare global {
  interface Window {
    Clerk: {
      openSignIn: () => void;
      openSignUp: () => void;
    };
  }
}

export {}; 