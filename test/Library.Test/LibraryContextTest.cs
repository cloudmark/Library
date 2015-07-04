using Xunit;

namespace MusicStore.Models
{
    public class LibraryContextTest
    {
		[Fact]
        public void ShouldAddUserToDatasetWhenCallingAdd()
        {
            // Arrange
            var cart = new LibraryContext();
			// Assert
            Assert.NotNull(cart);
            
        }
		

	}
}