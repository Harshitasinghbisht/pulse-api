-- DropIndex
DROP INDEX "Invitation_workspaceId_idx";

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "role" "WorkspaceRole" NOT NULL DEFAULT 'VIEWER';
