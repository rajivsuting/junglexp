import { Separator } from "@/components/ui/separator";
import { ConfigurationForm } from "@/features/configurations/components/configuration-form";
import { getConfiguration } from "@repo/actions/configurations.actions";
import PageContainer from "@/components/layout/page-container";

export default async function ConfigurationsPage() {
  // Fetch existing configuration (if any) to pass as initial data
  const homePageTitleConfig = await getConfiguration("home_page_title");
  const homePageCtaTextConfig = await getConfiguration("home_page_cta_text");
  const homePageCtaLinkConfig = await getConfiguration("home_page_cta_link");

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Configurations</h2>
        </div>
        <p className="text-muted-foreground">
          Manage global configurations for the client application.
        </p>
        <Separator />
        <div className="w-full">
          <div className="space-y-6 w-full">
            <div>
              <h3 className="text-lg font-medium">Global Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure general settings for the application.
              </p>
            </div>
            <Separator />
            <ConfigurationForm
              initialData={{
                home_page_title: homePageTitleConfig?.value || "",
                home_page_cta_text: homePageCtaTextConfig?.value || "",
                home_page_cta_link: homePageCtaLinkConfig?.value || "",
              }}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
