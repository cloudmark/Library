using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Framework.DependencyInjection;
using Library.Models;
using AutoMapper;
using Library.Services;
using Library.Spa.Dtos;
using Microsoft.AspNet.Authentication.Cookies;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Authentication.Internal;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.OptionsModel;
using Microsoft.Framework.Runtime;
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
                .AddSqlServer()
                .AddDbContext<LibraryContext>(options =>
                {
                        Console.WriteLine("Detected Windows Runtime. ");
                        options.UseSqlServer(Configuration.Get("Data:DefaultConnection:ConnectionString"));
                });

//             Add Identity services to the services container
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<LibraryContext>()
                    .AddDefaultTokenProviders();

//            services.AddAuthentication();
//            services.AddAuthorization();
             
            // Configure Auth
            services.Configure<AuthorizationOptions>(options =>
            {
                options.AddPolicy("app-ManageStore", new AuthorizationPolicyBuilder().RequireClaim("app-ManageStore", "Allowed").Build());
            });

            // Create the services
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ILoanService, LoanService>();

            // Configure the mapper
            Mapper.CreateMap<Book, BookResultDto>();
            Mapper.CreateMap<Book, BookDetailedResultDto>(); 
            Mapper.CreateMap<BookChangeDto, Book>();
            Mapper.CreateMap<User, UserResultDto>();
            Mapper.CreateMap<User, UserDetailResultDto>();
            Mapper.CreateMap<UserChangeDto, User>();
            Mapper.CreateMap<Loan, LoanResultDto>();
            Mapper.CreateMap<Loan, LoanDetailsResultDto>();
            Mapper.CreateMap<LoanChangeDto, Loan>();


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

            // Add cookie-based authentication to the request pipeline
            app.UseCookieAuthentication(c => {
                c.LoginPath = new PathString("/Account/Login");
            });

            app.UseIdentity();

            // Add MVC
            app.UseMvc();

            // Add SPA
            app.UseSpa(new SpaOptions() {DebugMode = true}); 

        }
    }

}

