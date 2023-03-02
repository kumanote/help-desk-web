export default async function IndexPage() {
  // this page does not show anything.
  // If workspace has not been initialized, then user will be redirected to `/[lang]/welcome` page.
  // Otherwise, the user will be redirected to `/[lang]/login` page.
  return <div className="fixed inset-0 bg-color-base"></div>
}
