'use client'
import { useCallback, useEffect, useState } from 'react';
import { setFormOpen } from "../../store/slices/getPageDetailsSlice";
import CreateBtn from '../Buttons/createBtn';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header';
import FixedHeaderTable from './FixedHeaderTable';
import SearchInput from '../Search';
import PageHeader from '../PageHeader';
import Pagination from '../Pagination';
import Sort from '../Buttons/Sort';
import FilterBtn from '../Buttons/FilterBtn';



const UserTbl = ({ tblData, loading, columns, title }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const CurrentFormSts = useSelector(state => state.pageDetails.isFormOpen);
    const dispatch = useDispatch();
    const [showSort,setShowSort] = useState(false)
    const [showFilter,setShowFilter] = useState(false)

    const HandleFormOpen = useCallback(() => {
        dispatch(setFormOpen(!CurrentFormSts));
    }, [dispatch, CurrentFormSts]);

    useEffect(() => {
        // simple visibility for data flow during dev
       // console.log("UserTbl received tblData:", tblData);
    }, [tblData]);

    const totalRows = Array.isArray(tblData) ? tblData.length : 0;
    const pageCount = pageSize > 0 ? Math.ceil(totalRows / pageSize) : 0;

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex + 1 < pageCount;

    const handleNextPage = () => {
        if (canNextPage) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (canPreviousPage) setPageIndex(prev => prev - 1);
    };

    const handlePaginationChange = updater => {
        // TanStack passes either a functional updater or value
        if (typeof updater === 'function') {
            const newState = updater({ pageIndex, pageSize });
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
        } else if (updater && typeof updater === 'object') {
            if (typeof updater.pageIndex === 'number') setPageIndex(updater.pageIndex);
            if (typeof updater.pageSize === 'number') setPageSize(updater.pageSize);
        }
    };

    return (
        <>
            <Header title={title} />
            <PageHeader
            leftContent={<div className='flex items-center gap-x-2'>
                <CreateBtn onClick={HandleFormOpen} />
                <Sort options={[{}]} onClick={()=>setShowSort(!showSort)} show={showSort}/>
                <FilterBtn options={[{}]} onClick={()=>setShowFilter(!showFilter)} show={showFilter}/>
            </div>}
            rightContent={<div className='flex items-center gap-x-2'>
                <Pagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    canNextPage={canNextPage}
                    canPreviousPage={canPreviousPage}
                />
                <SearchInput
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search"
                    />
            </div>}
            />
                
            <FixedHeaderTable
                data={tblData}
                columns={columns}
                loading={loading}
                pageIndex={pageIndex}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                showSearch={false}
                showPagination={true}
                globalFilter= {globalFilter}
            />
        </>
    )
}

export default UserTbl;
