import { SignIn } from "@clerk/nextjs";

export default function CustomSignIn() {
  return (
    <div className="flex items-center justify-center">
      <SignIn
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
