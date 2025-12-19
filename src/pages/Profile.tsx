import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";

const ProfilePage = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold mb-8">Your Profile</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Profile management will be available when backend is connected.</p>
            <Button variant="outline" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Button variant="destructive" className="gap-2">
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </Layout>
  );
};

export default ProfilePage;
