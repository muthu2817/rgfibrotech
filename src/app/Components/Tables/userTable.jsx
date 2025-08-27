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



const UserTbl = ({ tblData, loading, columns, title }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const CurrentFormSts = useSelector(state => state.pageDetails.isFormOpen);
    const dispatch = useDispatch();
    const [showSort,setShowSort] = useState(false)

    const HandleFormOpen = useCallback(() => {
        dispatch(setFormOpen(!CurrentFormSts));
    }, [dispatch, CurrentFormSts]);

    useEffect(() => {
        // simple visibility for data flow during dev
       // console.log("UserTbl received tblData:", tblData);
    }, [tblData]);

    

    return (
        <>
            <Header title={title} />

            <PageHeader
            leftContent={<div className='flex items-center gap-x-2'>
                <CreateBtn onClick={HandleFormOpen} />
                <Sort options={[{}]} onClick={()=>setShowSort(!showSort)} show={showSort}/>
            </div>}
            rightContent={<div className='flex items-center gap-x-2'>
                <Pagination onNextPage={()=>{}} onPreviousPage={()=>{}} pageCount={10} pageIndex={1}/>
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
                pageSize={20}
                showSearch={false}
                showPagination={true}
                globalFilter= {globalFilter}
            />
        </>
    )
}

export default UserTbl;
