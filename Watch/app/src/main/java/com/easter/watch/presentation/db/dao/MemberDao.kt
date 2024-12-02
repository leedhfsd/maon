package com.easter.watch.presentation.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.easter.watch.presentation.db.entity.Member

@Dao
interface MemberDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMember(member: Member)

    // member에 데이터가 있는지 확인
    @Query("SELECT COUNT(*) FROM member")
    suspend fun isMemberExists(): Int

    @Query("DELETE FROM member")  // 테이블의 모든 데이터 삭제
    suspend fun deleteAll()

    // member 테이블에 데이터가 하나라도 존재하는지 확인
    @Query("SELECT EXISTS(SELECT 1 FROM member)")
    suspend fun isAnyMemberExists(): Boolean

    // 항상 데이터가 하나만 존재하므로 단일 값 반환
    @Query("SELECT memberId FROM member LIMIT 1")
    suspend fun getMemberId(): String

}