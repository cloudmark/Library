﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Data.Entity;

namespace Library.Infrastructure
{
    public interface IPagedList<out T>
    {
        IEnumerable<T> Data { get; }

        int Page { get; }

        int PageSize { get; }

        int TotalCount { get; }
    }

    internal class PagedList<T> : IPagedList<T>
    {
        public PagedList(IEnumerable<T> data, int page, int pageSize, int totalCount)
        {
            Data = data;
            Page = page;
            PageSize = pageSize;
            TotalCount = totalCount;
        }

        public IEnumerable<T> Data { get; private set; }

        public int Page { get; private set; }

        public int PageSize { get; private set; }

        public int TotalCount { get; private set; }
    }

    public static class PagedListExtensions
    {
        public static IPagedList<T> ToPagedList<T>(this IQueryable<T> query, int page, int pageSize)
        {
            if (query == null)
            {
                throw new ArgumentNullException("query");
            }

            var pagingConfig = new PagingConfig(page, pageSize);
            var skipCount = ValidatePagePropertiesAndGetSkipCount(pagingConfig);

            var data = query
                .Skip(skipCount)
                .Take(pagingConfig.PageSize)
                .ToList();

            if (skipCount > 0 && data.Count == 0)
            {
                // Requested page has no records, just return the first page
                pagingConfig.Page = 1;
                data = query
                    .Take(pagingConfig.PageSize)
                    .ToList();
            }

            return new PagedList<T>(data, pagingConfig.Page, pagingConfig.PageSize, query.Count());
        }

        public static Task<IPagedList<TModel>> ToPagedListAsync<TModel, TProperty>(this IQueryable<TModel> query, int page, int pageSize, string sortExpression, Expression<Func<TModel, TProperty>> defaultSortExpression, SortDirection defaultSortDirection = SortDirection.Ascending)
            where TModel : class
        {
            return ToPagedListAsync<TModel, TProperty, TModel>(query, page, pageSize, sortExpression, defaultSortExpression, defaultSortDirection, null);
        }



        public static async Task<IPagedList<TResult>> ToPagedListAsync<TModel, TProperty, TResult>(this IQueryable<TModel> query, int page, int pageSize, string sortExpression, Expression<Func<TModel, TProperty>> defaultSortExpression, SortDirection defaultSortDirection, Func<TModel, TResult> selector = null)
            where TModel : class
            where TResult : class
        {
            if (query == null)
            {
                throw new ArgumentNullException("query");
            }

            var pagingConfig = new PagingConfig(page, pageSize);
            var skipCount = ValidatePagePropertiesAndGetSkipCount(pagingConfig);
            var dataQuery = query;

            if (defaultSortExpression != null)
            {
                dataQuery = dataQuery
                    .SortBy(sortExpression, defaultSortExpression);
            }

            var data = await dataQuery
                .Skip(skipCount)
                .Take(pagingConfig.PageSize).ToListAsync();


            if (skipCount > 0 && data.Count == 0)
            {
                // Requested page has no records, just return the first page
                pagingConfig.Page = 1;
                data = await dataQuery
                    .Take(pagingConfig.PageSize)
                    .ToListAsync();
            }

            var count = await query.CountAsync();
            var resultData = data.MapTo(selector);
            return new PagedList<TResult>(resultData, pagingConfig.Page, pagingConfig.PageSize, count);
        }

        public static IEnumerable<TResult> MapTo<TModel, TResult>(this IEnumerable<TModel> data, Func<TModel, TResult> selector) where TModel : class where TResult : class
        {
            return selector != null ? data.Select(selector) : data.Cast<TResult>();
        }

        private static int ValidatePagePropertiesAndGetSkipCount(PagingConfig pagingConfig)
        {
            if (pagingConfig.Page < 1)
            {
                pagingConfig.Page = 1;
            }

            if (pagingConfig.PageSize < 10)
            {
                pagingConfig.PageSize = 10;
            }

            if (pagingConfig.PageSize > 100)
            {
                pagingConfig.PageSize = 100;
            }

            return pagingConfig.PageSize * (pagingConfig.Page - 1);
        }

        public class PagingConfig
        {
            public PagingConfig(int page, int pageSize)
            {
                Page = page;
                PageSize = pageSize;
            }

            public int Page { get; set; }

            public int PageSize { get; set; }
        }
    }
}