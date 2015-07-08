using System;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Diagnostics.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Library.Models;
using Library.Dtos;
using AutoMapper;

namespace Library.Spa
{
    public class Startup
    {
        public Startup()
        {
            // .AddJsonFile("Config.json")
            Configuration = new Configuration().AddEnvironmentVariables();
        }

        public Microsoft.Framework.ConfigurationModel.IConfiguration Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add the Mvc
            services.AddMvc();

            // Add the Context; 
            services.AddSingleton<LibraryContext>();
            
            
            // Configure the mapper
            Mapper.CreateMap<BookChangeDto, Book>();      
        }

        public void Configure(IApplicationBuilder app)
        {
            // Add the runtime information page that can be used by developers
            // to see what packages are used by the application
            // default path is: /runtimeinfo
            // app.UseRuntimeInfoPage();

            // Show all errors; 
            app.UseErrorPage(ErrorPageOptions.ShowAll);

            //Are we ruuning on Mono?
            var useInMemoryStore = Type.GetType("Mono.Runtime") != null;

            if (useInMemoryStore)
            {
                System.Console.WriteLine("=================================================");
                System.Console.WriteLine("Running on Mac or Linux");
                System.Console.WriteLine("=================================================");

            }
            else
            {
                System.Console.WriteLine("=================================================");
                System.Console.WriteLine("Running on Windows ");
                System.Console.WriteLine("=================================================");
            }

            // Initialize the sample data
            var libraryContext = app.ApplicationServices.GetService<LibraryContext>();
            SampleData.InitializeLibraryDatabase(libraryContext);
            System.Console.WriteLine("=================================================");
            foreach (var loan in libraryContext.Loans)
            {
                System.Console.WriteLine($"[Book {loan.Book.Id}:{loan.Book.Name}] -> [User {loan.User.Id}:{loan.User.Name}] ");
            }
            System.Console.WriteLine("=================================================");
            System.Console.WriteLine(libraryContext.GetHashCode());    

            // Add static files
            app.UseStaticFiles();

            // Add MVC
            app.UseMvc();

        }
    }

}

