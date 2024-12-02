package com.easter.watch.presentation.db

import android.content.Context
import androidx.room.Database
import androidx.room.DatabaseConfiguration
import androidx.room.InvalidationTracker
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.sqlite.db.SupportSQLiteOpenHelper
import com.easter.watch.presentation.db.dao.MemberDao
import com.easter.watch.presentation.db.entity.Member

@Database(entities = [Member::class], version = 2, exportSchema = false)
abstract class MemberDatabase : RoomDatabase() {

    abstract fun memberDao(): MemberDao

    companion object {
        @Volatile
        private var INSTANCE: MemberDatabase? = null

        fun getDatabase(context: Context): MemberDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    MemberDatabase::class.java,
                    "member_database"
                )
                    .fallbackToDestructiveMigration() // 데이터 삭제 후 새로 생성
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}