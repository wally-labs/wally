import { SignUp } from "@clerk/nextjs";

export default function CustomSignUp() {
  return (
    <div className="flex items-center justify-center">
      <SignUp
        afterSignOutUrl={"/"}
        appearance={{
          elements: {
            formButtonPrimary: "btn-login-gradient !ring-0",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            logoImageUrl: "/wally-logo.png",
          },
        }}
      />
    </div>
  );
}
