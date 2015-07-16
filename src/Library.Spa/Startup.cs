using System;
using System.IdentityModel.Tokens;
using System.Security.Cryptography.X509Certificates;
using AutoMapper;
using Library.Models;
using Library.Services;
using Library.Spa.Dtos;
using Library.Spa.idsrv;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;
using Spa.Extensions.Extenstions;
using Thinktecture.IdentityServer.Core.Configuration;
using Constants = Library.Spa.idsrv.Constants;
using IConfiguration = Microsoft.Framework.Configuration.IConfiguration;

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

        public IConfiguration Configuration { get; set; }

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

            // Add Identity services to the services container
            services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<LibraryContext>()
                    .AddDefaultTokenProviders();

            services.AddAuthentication();
            services.AddAuthorization();
             
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

        public void Configure(IApplicationBuilder app, IApplicationEnvironment env )
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
            //            app.UseCookieAuthentication(c => {
            //                c.LoginPath = new PathString("/Account/Login");
            //            });
            //
            //            app.UseIdentity();
            //
            //            // Add MVC
            //            app.UseMvc();

            var certFile = env.ApplicationBasePath + "\\idsrv3test.pfx";

            app.Map("/core", core =>
            {
                var factory = InMemoryFactory.Create(
                                        users: Users.Get(),
                                        clients: Clients.Get(),
                                        scopes: Scopes.Get());

                var idsrvOptions = new IdentityServerOptions
                {
                    IssuerUri = "https://idsrv3.com",
                    SiteName = "test vnext Identity server",
                    Factory = factory,
                    SigningCertificate = new X509Certificate2(certFile, "idsrv3test"),
                    RequireSsl = false,

                    CorsPolicy = CorsPolicy.AllowAll,

                    AuthenticationOptions = new AuthenticationOptions
                    {
                    }
                };

                core.UseIdentityServer(idsrvOptions);
            });


            app.Map("/api", api =>
            {

                api.UseOAuthBearerAuthentication(options => {
                    options.AutomaticAuthentication = true;
                    options.Authority = Constants.AuthorizationUrl;
                    // options.MetadataAddress = Constants.AuthorizationUrl + "/.well-known/openid-configuration";
                    options.TokenValidationParameters = new TokenValidationParameters{
                        ValidAudience = "https://idsrv3.com/resources",
                        ValidateLifetime = false
                    };
                });

                api.UseMvc();

            });

            

            // Add SPA
            app.UseSpa(new SpaOptions() { DebugMode = true });



        }
    }

}

