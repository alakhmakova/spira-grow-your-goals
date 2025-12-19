import { Layout } from "@/components/layout/Layout";
import { SpiraLogo } from "@/components/SpiraLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfoPage = () => {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">The GROW Coaching Model</h1>

        <section id="grow-model" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>What is GROW?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>GROW is a coaching framework that helps you set and achieve goals effectively:</p>
              <ul>
                <li><strong>G</strong>oal - What do you want to achieve?</li>
                <li><strong>R</strong>eality - Where are you now?</li>
                <li><strong>O</strong>ptions - What could you do?</li>
                <li><strong>W</strong>ill - What will you do?</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="set-goals" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>How to Set Goals Using Spira</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Make your goals SMART: Specific, Measurable, Achievable, Relevant, Time-bound.</p>
            </CardContent>
          </Card>
        </section>

        <section id="reality" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Exploring Reality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Assess your current situation honestly. What have you tried? What obstacles exist?</p>
            </CardContent>
          </Card>
        </section>

        <section id="options" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Exploring Options</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Brainstorm all possible paths to your goal without judgment.</p>
            </CardContent>
          </Card>
        </section>

        <section id="will" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Exploring Will</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Commit to specific actions. What will you do, and by when?</p>
            </CardContent>
          </Card>
        </section>

        <section id="targets" className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Setting Targets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Break your goal into measurable steps with clear success criteria.</p>
            </CardContent>
          </Card>
        </section>

        <footer id="contacts" className="pt-8 border-t text-center">
          <SpiraLogo size="md" className="justify-center mb-4" />
          <p className="text-muted-foreground">Questions? Contact us at hello@spira.app</p>
        </footer>
      </div>
    </Layout>
  );
};

export default InfoPage;
