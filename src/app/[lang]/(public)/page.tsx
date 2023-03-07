export default async function IndexPage() {
  // this page does not show anything meaningful.
  // If workspace has not been initialized, then user will be redirected to `/[lang]/welcome` page.
  // Otherwise, the user will be redirected to `/[lang]/login` page.
  // TODO nice custom loading animation.
  return <div className="fixed inset-0 bg-color-base"></div>
}
