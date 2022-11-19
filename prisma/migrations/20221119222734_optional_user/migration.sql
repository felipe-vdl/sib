-- DropForeignKey
ALTER TABLE `registros` DROP FOREIGN KEY `registros_user_id_fkey`;

-- AlterTable
ALTER TABLE `registros` MODIFY `cracha_frente` TEXT NULL,
    MODIFY `cracha_verso` TEXT NULL,
    MODIFY `user_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `registros` ADD CONSTRAINT `registros_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
