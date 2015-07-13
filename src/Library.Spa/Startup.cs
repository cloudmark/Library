using System;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Framework.DependencyInjection;
using Library.Models;
using AutoMapper;
using Library.Services;
using Library.Spa.Dtos;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Runtime;
using Microsoft.Framework.DependencyInjection; 
using Microsoft.Data.Entity;
using Spa.Extensions.Extenstions;

namespace Library.Spa
{
    public class Startup
    {
        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var configurationBuilder = new ConfigurationBuilder(appEnv.ApplicationBasePath)
               .AddJsonFile("Config.json")
               .AddEnvironmentVariables();
            Configuration = configurationBuilder.Build();
        }

        public Microsoft.Framework.Configuration.IConfiguration Configuration { get; set; }

        public void ConfigureServices(IServiceCollection services)
        {

            services.Configure<SiteSettings>(settings =>
            {
                settings.DefaultAdminUsername = Configuration.Get("DefaultAdminUsername");
                settings.DefaultAdminPassword = Configuration.Get("DefaultAdminPassword");
            });

            
            
            // Add the Mvc
            services.AddMvc();
            
            services.AddEntityFramework()
                .AddSqlite()
                .AddSqlServer()
                .AddDbContext<LibraryContext>(options =>
                {
                    if (Type.GetType("Mono.Runtime") != null)
                    {
                        Console.WriteLine("Detected Linux/Mac Runtime. ");
                        options.UseSqlite("Data Source=Library.db");
                    }
                    else
                    {
                        Console.WriteLine("Detected Windows Runtime. ");
                        options.UseSqlServer(Configuration.Get("Data:DefaultConnection:ConnectionString"));
                    }
                });

            // Add Identity services to the services container
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<LibraryContext>()
                    .AddDefaultTokenProviders();

            // Configure Auth
            //            services.Configure<AuthorizationOptions>(options =>
            //            {
            //                options.AddPolicy("app-ManageStore", new AuthorizationPolicyBuilder().RequireClaim("app-ManageStore", "Allowed").Build());
            //            });

            // Create the services
            services.AddSingleton<IBookService, BookService>();
            services.AddSingleton<IUserService, UserService>();
            services.AddSingleton<ILoanService, LoanService>();

            // Configure the mapper
            Mapper.CreateMap<Book, BookResultDto>();
            Mapper.CreateMap<Book, BookDetailedResultDto>(); 
            Mapper.CreateMap<BookChangeDto, Book>();


        }

        public void Configure(IApplicationBuilder app)
        {

            // Add the runtime information page that can be used by developers
            // to see what packages are used by the application
            // default path is: /runtimeinfo
            // app.UseRuntimeInfoPage();

            // Show all errors; 
            app.UseErrorPage();

            // Initialize the sample data
            SampleData.InitializeLibraryDatabaseAsync(app.ApplicationServices).Wait();

            // Add static files
            app.UseStaticFiles();

            // Add MVC
            app.UseMvc();

            // Add SPA
            app.UseSpa(new SpaOptions() {DebugMode = true}); 

        }
    }

}

