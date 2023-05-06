rootProject.name = "invitations-verifier-service"

//includeBuild("../../libraries/merkle-tree/lib")

val projectDirs = listOf("../../libraries")

projectDirs.forEach {
    file(it).listFiles()?.forEach { moduleBuild: File ->
        if (moduleBuild.isDirectory) {
            includeBuild(moduleBuild)
        }
    }
}
