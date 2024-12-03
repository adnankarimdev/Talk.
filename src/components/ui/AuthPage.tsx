import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LucideProps } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buisnessName, setBuisnessName] = useState("");
  const [accountType, setAccountType] = useState("google-business");
  const { toast } = useToast();
  const router = useRouter();

  // Hiding online business & influencer on prod for now
  const accountTypeOptions = [
    { value: "google-business", label: "Google Business 🏢" },
    // { value: "online-business", label: "Social Media Business 🧑‍💻" },
    // { value: "influencer", label: "Social Media Icon ⭐️" },
  ];

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const handleLogin = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/login/`, {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("accountType", response.data.account_type);
        sessionStorage.setItem("authToken", response.data.token);
        toast({
          title: "Successfully Logged In",
          description: "Welcome to Talk..",
          duration: 1000,
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      })
      .catch((error) => {
        toast({
          title: "Failed to login",
          description: error.response.data.error,
          duration: 1000,
        });
      });
  };
  const handleSignUp = () => {
    // TODO: add valdiation steps here
    // For now, we'll save the number of locations as 1.
    // Eventually, we'll need to set up the backend to select the number of locations based on pricing.
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/sign-up/`, {
        email: email,
        password: password,
        business_name: buisnessName,
        account_type: accountType,
      })
      .then((response) => {
        toast({
          title: "User Created",
          description: "Welcome to Talk..",
          duration: 1000,
        });
        localStorage.setItem("userEmail", email);
        localStorage.setItem("accountType", accountType);
        sessionStorage.setItem("authToken", response.data.token);
        setTimeout(() => {
          if (accountType == "google-business") {
            router.push("/placefinder");
          }
          if (accountType == "online-business" || accountType == "influencer") {
            router.push("/socialsignup");
          }
        }, 2000);
      })
      .catch((error) => {
        toast({
          title: "Failed to sign up.",
          description: "It's not you, it's us. Please try again.",
          duration: 1000,
        });
      });
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Sign up or log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="mt-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="abc@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <Label className="mt-2" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="mt-2"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="mt-2" htmlFor="account-select">
                    Account Type
                  </Label>
                  <Select
                    onValueChange={setAccountType}
                    defaultValue={accountType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Account Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label className="mt-2" htmlFor="email">
                    {accountType === "influencer" ? "Name" : "Buisness Name"}
                  </Label>
                  <Input
                    id="buisnessName"
                    value={buisnessName}
                    onChange={(e) => setBuisnessName(e.target.value)}
                    placeholder="Phil & Sebastian"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <Label className="mt-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abc@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <Label className="mt-2" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  disabled={isLoading}
                  onClick={handleSignUp}
                  className="mt-2"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign up
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        {/* Hiding login/signup with google since its not implemented lol */}
        {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          hidden={true}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FaGoogle className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button> */}
      </CardContent>
    </Card>
  );
}
