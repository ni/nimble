using Xunit;

namespace NimbleBlazor.Tests.Acceptance
{
    [CollectionDefinition(nameof(PlaywrightFixture))]
    public class SharedPlaywrightCollectionDefinition : ICollectionFixture<PlaywrightFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
